# rbxts-transform-dce

Transformer for roblox-ts that eliminates dead code

# Example
```ts
const log_enabled = true;
let debug_mode = false;

if (log_enabled) {
    print("some important log");
}

// debug_mode is known false at this point
if (debug_mode) {
    // Do some debug operation
    print("some debug collision check");
}

let counter = 0;
while (debug_mode) {
    counter += 1;
    task.wait(1);
}

```
this would render to:
```lua
local log_enabled = true
local debug_mode = false
do
        print("some important log")
end
local counter = 0
```

roblox-ts render without rbxts-tranform-dce
```lua
local log_enabled = true
local debug_mode = false
if log_enabled then
        print("some important log")
end
-- debug_mode is known false at this point
if debug_mode then
        -- Do some debug operation
        print("some debug collision check")
end
local counter = 0
while debug_mode do
        counter += 1
        task.wait(1)
end
```

## What it does
- Eliminates `if` statements, `while` loops, and `do-while` loops whose condition is statically known to be `false` (unreachable).
- Unwraps `if` statements whose condition known to be `true` at compile time, keeping the body.

## What it does not
- Remove unused variables left behind by eliminated branches.
- Touch for loops (for now?).
- Touch branches that depends on runtime or too complex to resolve at compile time.

# Installation

`npm i rbxts-transform-dce`, then in your tsconfig.json

```json
    "compilerOptions": {
        ...
        "plugins": [
            {
                "transform": "rbxts-transform-dce"
            }
        ],
    }
```
