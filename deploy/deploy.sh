#!/bin/sh
# Builds the ARM image on this computer and starts it on the Oracle Cloud VM.
# Usage: deploy/deploy.sh    (from the repository root, on an ARM computer)
set -eu

HOST="${DEPLOY_HOST:-ubuntu@148.116.90.189}"
KEY="${DEPLOY_KEY:-$HOME/.ssh/relay_mail_vm}"
TAG="$(git rev-parse --short HEAD)"
SSH="ssh -i $KEY -o IdentitiesOnly=yes"

docker build --platform linux/arm64 --secret id=env,src=.env.production -t "me:$TAG" .
docker save "me:$TAG" | gzip | $SSH "$HOST" 'gunzip | docker load'

$SSH "$HOST" 'sudo install -d -o ubuntu -g ubuntu -m 750 /opt/me'
scp -i "$KEY" -o IdentitiesOnly=yes deploy/compose.yaml "$HOST:/opt/me/compose.yaml"
# The Redis tokens. Only the ubuntu user can read the file.
grep '^UPSTASH_' .env.production | tr -d '"' | $SSH "$HOST" 'umask 077 && cat > /opt/me/app.env'

$SSH "$HOST" "set -e
  cd /opt/me
  echo IMAGE_TAG=$TAG > .env
  docker compose up -d
  docker image prune -f > /dev/null"

for _ in $(seq 1 30); do
  status=$($SSH "$HOST" "docker inspect -f '{{.State.Health.Status}}' \$(docker compose -f /opt/me/compose.yaml ps -q web)")
  echo "web: $status"
  [ "$status" = healthy ] && exit 0
  sleep 5
done
$SSH "$HOST" 'docker compose -f /opt/me/compose.yaml logs --tail 50 web'
exit 1
