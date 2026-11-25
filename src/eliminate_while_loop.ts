import ts from "typescript";
import { is_definitely_false } from "./is_definitely";

export default function eliminate_while_loop(node: ts.Node | undefined, checker: ts.TypeChecker): ts.Node | undefined {
	if (node === undefined || !ts.isWhileStatement(node)) return node;

	const exp_type = checker.getTypeAtLocation(node.expression);

	if (is_definitely_false(exp_type, checker)) return undefined;
	else return node;
}
