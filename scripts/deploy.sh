set -e
set -x

STAGE=$1
TAG=$2

helm upgrade --reuse-values --set analytics.image.repository=public.ecr.aws/x0k5y3h8/xrengine-$TAG-analytics,analytics.image.tag=$TAG,api.image.repository=public.ecr.aws/x0k5y3h8/xrengine-$TAG-api,api.image.tag=$TAG,gameserver.image.repository=public.ecr.aws/x0k5y3h8/xrengine-$TAG-gameserver,gameserver.image.tag=$TAG,client.image.repository=public.ecr.aws/x0k5y3h8/xrengine-$TAG-client,client.image.tag=$TAG $STAGE xrengine/xrengine
