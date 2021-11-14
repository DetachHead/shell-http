# shell-http

run commands from a HTTP request

## why?

getting containers to talk to each other is a pain. `shell-http` is an
alternative to setting up SSH in both containers or creating a http server tied
to your specific use case.

`shell-http` is a single standalone binary, so you should be able to easily
throw it into any container without too much trouble. for example, this is all
you need to do to set up a HTTP api for `ffmpeg` (assuming you have the binary
in your working directory):

```dockerfile
FROM jrottenberg/ffmpeg
COPY shell-http .
ENTRYPOINT ["shell-http"]
```

```shell
docker run -d -p 8000:80 image_name ffmpeg
```

## download

https://github.com/DetachHead/shell-http/releases

## usage

### start the server

```
shell-http git deno
```

this will expose the `git` and `deno` commands

### example

#### request

```
POST http://localhost:8000/git?args=status
```

#### response

```json
{
  "stdout": "",
  "stderr": "fatal: not a git repository (or any of the parent directories): .git\n"
}
```
