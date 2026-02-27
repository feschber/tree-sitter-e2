/**
 * @file E2 grammar for tree-sitter
 * @author Ferdinand Schober <ferdinandschober20@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "e2",

  extras: ($) => [/\s/, $.comment],

  rules: {
    source_file: ($) => repeat($.global_declaration),

    global_declaration: ($) =>
      choice($.variable_declaration, $.function_declaration),

    variable_declaration: ($) =>
      seq("var", $.identifier, ":", $.type_name, ";"),

    function_declaration: ($) =>
      seq(
        "func",
        $.identifier,
        "(",
        optional(
          seq(
            $.parameter_declaration,
            repeat(seq(",", $.parameter_declaration)),
          ),
        ),
        ")",
        optional(seq(":", $.type_name)),
        optional($.block),
        "end",
      ),

    parameter_declaration: ($) => seq($.identifier, ":", $.type_name),

    type_name: ($) =>
      seq(
        $.primitive_type_name,
        repeat(seq("[", $.arithmetic_expression, "]")),
      ),

    primitive_type_name: ($) => choice("int", "real"),
    block: ($) =>
      choice(
        seq(repeat($.variable_declaration), repeat1($.statement)),
        seq(repeat1($.variable_declaration), repeat($.statement)),
      ),

    statement: ($) =>
      choice(
        $.function_call_statement,
        $.assign_statement,
        $.if_statement,
        $.while_statement,
        $.return_statement,
      ),
    function_call_statement: ($) => seq($.function_call, ";"),
    assign_statement: ($) => seq($.lvalue, ":=", $.arithmetic_expression, ";"),
    if_statement: ($) =>
      seq(
        "if",
        $.conditional_expression,
        "then",
        optional($.block),
        optional(seq("else", optional($.block))),
        "end",
      ),
    while_statement: ($) =>
      seq("while", $.conditional_expression, "do", optional($.block), "end"),
    return_statement: ($) =>
      seq("return", optional($.arithmetic_expression), ";"),
    identifier: ($) => $.IDENTIFIER,
    lvalue: ($) => choice($.identifier, $.array_access),
    conditional_expression: ($) => $.or_expression,
    or_expression: ($) =>
      seq($.and_expression, repeat(seq("or", $.and_expression))),
    and_expression: ($) =>
      seq($.compare_expression, repeat(seq("and", $.compare_expression))),
    compare_expression: ($) =>
      choice(
        seq(
          $.arithmetic_expression,
          choice("==", "!=", "<", "<=", ">", ">="),
          $.arithmetic_expression,
        ),
        seq("( ", $.conditional_expression, ")"),
      ),
    arithmetic_expression: ($) => $.additive_expression,
    additive_expression: ($) =>
      seq(
        $.multiplicative_expression,
        repeat(seq(choice("+", "-"), $.multiplicative_expression)),
      ),
    multiplicative_expression: ($) =>
      seq($.factor, repeat(seq(choice("*", "/"), $.factor))),
    factor: ($) =>
      choice(
        $.variable_access,
        $.number_literal,
        $.function_call,
        $.array_access,
        seq("(", $.arithmetic_expression, ")"),
        seq("(", $.arithmetic_expression, "as", $.primitive_type_name, ")"),
      ),
    variable_access: ($) => $.identifier,
    number_literal: ($) => choice($.NUMBER, $.CHAR_LITERAL),
    function_call: ($) =>
      seq(
        $.identifier,
        "(",
        optional(seq($.argument, repeat(seq(",", $.argument)))),
        ")",
      ),
    argument: ($) => $.arithmetic_expression,
    array_access: ($) =>
      seq($.identifier, repeat1(seq("[", $.arithmetic_expression, "]"))),
    // WHITESPACE: ($) => choice( ' ' , '\t ' , '\r' , '\n'), // skipped
    // COMMENT: ($) => seq('#', repeat(not(choice( '\ n ', '\ r '))), optional('\ r '), '\ n '), // skipped
    NUMBER: ($) => /[0-9]+(\.[0-9]* )?/,
    CHAR_LITERAL: ($) => /\'[-~]'\''/,
    IDENTIFIER: ($) => /[a-zA-Z_]+[a-zA-Z0-9_]*/,
    comment: (_) => token(seq("#", /[^\n]*/)),
  },
});
