# ReplitClone
This is an empty repo for anyone to add to and contribute to the replit clone.

## How we can program
Ironically, Replit is our best bet for programming this. I have created a team that is limited to 10 people. If we need more, we can figure something out. Please see the issue "I think I have a solution" for details. I have hooked the repo up to replit and made a test commit, and it works!

## Proposed structure (coding398)
We'll need 2 seperate server structures for this. One to host the website, and one to host the containers.

### Website
The website hoster can easily go offline and online quickly without much disruption to have quick updates, and all instances host the same content.
It will be built with vanilla React. Maybe webpack, but I haven't used it before. We will make our own little UI library with vanilla CSS, maybe PostCSS if we're feeling lucky.

For now I propose the backend of the site to be with Astro, Node, and MongoDB. (unless anyone has a better database option).
User file storage will probably be R2, but we need to consider a lot of variables for that.

### Container server nodes
The container servers connect to hosters and get information about which nodes run which user-code containers. They run arbitrary code in Docker, set up a MONITORED network connection, and pass requests through NGINX to the correct container.

In a perfect world, this would mean that each user container can use all available ports, just with a HOST header. Realistically though, it should only be permitted for port 80, 443, and everything above 2000. Other things like SSH and UDP should be disallowed.

We'll have a read-only file system that is shared with each and every container with some dependencies, to save on storage. The only thing that would be saved would be the user code. This means that users can't `apt-get` any packages.

Network monitoring should be for egress, specifically to limit the amount of bytes out per second. Instead of charging the user for egress, we take the node's total available network (e.g. 1Gbps), and split it over each container. If 500 containers run on one node, each gets 2MB/s minimum. There might be times where other containers can go above that limit when they need it, as all containers are unlikely to always use their full allocation 24/7.
