import ts from "typescript";

function is_number_type(type: ts.Type) {
    return !!(type.flags & (ts.TypeFlags.Number | ts.TypeFlags.NumberLike | ts.TypeFlags.NumberLiteral));
}

function is_template_literal_type(type: ts.Type): type is ts.TemplateLiteralType {
    return "texts" in type && "types" in type && !!(type.flags & ts.TypeFlags.TemplateLiteral);
}

function is_boolean_literal_type(value: boolean, type: ts.Type, checker: ts.TypeChecker): boolean {
    if (type.flags & ts.TypeFlags.BooleanLiteral) {
        const valueType = value ? checker.getTrueType() : checker.getFalseType();
        return type === valueType;
    } else {
        return false;
    }
}

function is_number_literal_type(value: number, type: ts.Type): boolean {
    if (type.isNumberLiteral()) {
        return type.value === value;
    } else {
        return false;
    }
}

export function is_empty_string_literal(type: ts.Type) {
    if (type.isStringLiteral()) {
        return type.value === "";
    }
    if (is_template_literal_type(type)) {
        return type.texts.length === 0 || type.texts.every((v) => v.length === 0);
    }
    return false;
}

function is_NAN_type(type: ts.Type): boolean {
    return is_number_type(type) && !type.isNumberLiteral();
}

export function is_definitely_false(type: ts.Type, checker: ts.TypeChecker): boolean {
    if (type.isUnion()) return type.types.every((t) => is_definitely_false(t, checker));

    if (is_boolean_literal_type(false, type, checker)) return true;

    if (is_number_literal_type(0, type)) return true;

    if (is_NAN_type(type)) return true;

    if (is_empty_string_literal(type)) return true;

    if (type.flags & ts.TypeFlags.Null) return true;

    if (type.flags & ts.TypeFlags.Undefined) return true;

    return false;
}

export function is_definitely_true(type: ts.Type, checker: ts.TypeChecker): boolean {
    if (type.isUnion()) return type.types.every((t) => is_definitely_true(t, checker));

    if (is_boolean_literal_type(true, type, checker)) return true;

    if (type.isNumberLiteral()) return type.value !== 0 && !Number.isNaN(type.value);

    if (type.isStringLiteral()) return type.value !== "";

    if (is_template_literal_type(type)) return false;

    return false;
}
