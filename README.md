# queueservice

A Docker image template to be used as a starting point for writing simple hapijs servers that automatically manage request queues.

## Configuration

Set the environment variable `MAX_PROCESSES` to `0` in order to serve any number of requests in parallel, set it to any other number to handle a prority queue of length equal to `MAX_PROCESSES`.