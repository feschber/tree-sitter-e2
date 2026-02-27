import XCTest
import SwiftTreeSitter
import TreeSitterE2

final class TreeSitterE2Tests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_e2())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading E2 grammar")
    }
}
