set -e
set -x

STAGE=$1
TAG=$2

helm upgrade --install --reuse-values -f ../packages/ops/configs/dev.builder.template.values.yaml --set builder.image.tag=$TAG $STAGE-builder xrengine/xrengine-builder
