package tree_sitter_e2_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_e2 "github.com/feschber/tree-sitter-e2/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_e2.Language())
	if language == nil {
		t.Errorf("Error loading E2 grammar")
	}
}
