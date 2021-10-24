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
## config
add commands in [`./endpoints.ts`](./endpoints.ts)
