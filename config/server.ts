import AuthSDK from "@gluestack-v2/glue-plugin-auth-sdk";

import { env } from "@gluestack/core";

export const config = {


    "providers": {
        // "auth": AuthSDK
    },
    "name": env('NAME', "my-app"),

};
