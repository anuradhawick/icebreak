<h1> 
IceBreak in <img src="https://go.dev/images/go-logo-white.svg" style="height:1em;vertical-align:middle;">
</h1>

<p align="center">
<img src="frontend/public/icebreak-logo.png" width="400px" style="display: block; margin: 0 auto;">
</p>

Visit: [https://icebreak.anuradhawick.com](https://icebreak.anuradhawick.com)

This website let's your group take breaks together by having a shared timer. No need to message everyone, sync times across time zones. No ambiguity ever!

> This is also a demo of how to build a full stack web application using Go, React, and AWS.

## Development Guide

Use pnpm to install react dependencies.

## Deploying

Make sure your code is clean.

```bash
pnpm run lint
```

Navigate to terraform folder and perform terraform deploy! Few things first.

```bash
cd terraform
```

Terraform state bucket is managed outside of the program. So it must be imported.

```bash
terraform import aws_s3_bucket.apps_bucket apps-anuradhawick
```

Once you have done that you can apply

```bash
terraform apply
```
