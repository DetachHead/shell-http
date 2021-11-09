# shell-http

run commands from a HTTP request

## example

### request

```
POST http://localhost:8000/git?args=status
```

### response

```json
{
  "stdout": "",
  "stderr": "fatal: not a git repository (or any of the parent directories): .git\n"
}
```

## usage

```
deno run --allow-net --allow-run main.ts git deno
```

this will expose the `git` and `deno` commands

## config

add commands in [`./endpoints.ts`](./endpoints.ts)
