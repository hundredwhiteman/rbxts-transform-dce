import ts from "typescript";
import { is_definitely_false, is_definitely_true } from "./is_definitely";

export default function eliminate_if_statement(node: ts.Node, checker: ts.TypeChecker): ts.Node | undefined {
	if (!ts.isIfStatement(node)) return node;

	const exp_type = checker.getTypeAtLocation(node.expression);

	// remove if statement if it evaluates to false for sure
	if (is_definitely_false(exp_type, checker)) {
		if (node.elseStatement) return eliminate_if_statement(node.elseStatement, checker);
		else return undefined;
	}

	if (is_definitely_true(exp_type, checker)) {
		return eliminate_if_statement(node.thenStatement, checker);
	}

	return node;
}
