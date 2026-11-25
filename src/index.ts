import ts from "typescript";
import eliminate_if_statement from "./eliminate_if_statement";
import eliminate_while_loop from "./eliminate_while_loop";
import eliminate_do_while_loop from "./eliminate_do_while_loop";

function make_visitor(context: ts.TransformationContext, checker: ts.TypeChecker): ts.Visitor {
    function visitor(node: ts.Node): ts.Node | undefined {
        let possible_node = eliminate_if_statement(node, checker);
        possible_node = eliminate_while_loop(possible_node, checker);
        possible_node = eliminate_do_while_loop(possible_node, checker);

        return ts.visitEachChild(possible_node, visitor, context);
    }
    return visitor;
}

function transformer_program(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
    function factory(context: ts.TransformationContext) {
        return (source_file: ts.SourceFile) => {
            return ts.visitNode(
                source_file,
                make_visitor(context, program.getTypeChecker()),
                ts.isSourceFile,
            ) as ts.SourceFile;
        };
    }

    return factory;
}

export default transformer_program;
