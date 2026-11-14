# Deploy on the Oracle Cloud VM

The site runs as a Docker container on the Oracle Cloud VM of the mail app (`sam-ayo/mail`). Caddy of the mail app gives HTTPS and sends `www.samayo.me` to this container.

- `../Dockerfile`: builds the standalone Next.js server.
- `compose.yaml`: runs the container from `/opt/me` on the VM. It connects the container to the `mail_default` network with the name `me`.
- `deploy.sh`: builds the ARM image on this computer, sends it to the VM, and starts it.

## Deploy a change

A push to `main` does not deploy. Run the script from the repository root on an ARM computer with Docker:

```sh
deploy/deploy.sh
```

The script reads `.env.production` for the build and writes the Redis tokens to `/opt/me/app.env` on the VM.

## The proxy

The site blocks for `www.samayo.me` and `samayo.me` are in `/opt/mail/Caddyfile` on the VM. The deploy workflow of the mail app replaces that file, so the same blocks must be in `deploy/Caddyfile` of the mail repository.

## DNS

In Netlify DNS, `samayo.me` and `www.samayo.me` must be A records with the IP address of the VM.

## Commands on the VM

```sh
cd /opt/me
docker compose ps              # state and health
docker compose logs -f web     # site logs
docker compose restart web     # restart the site
```
