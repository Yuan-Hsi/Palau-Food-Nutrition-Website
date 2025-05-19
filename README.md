# Project Overview
## Background
- In Palau's school kitchens, communication with the Ministry of Education is essential for tasks like reporting meal counts, placing orders, and sharing menus, but currently takes place across multiple channels.  
- The absence of a centralized platform for collecting feedback from both kitchen staff and students on menu changes has resulted in significant food waste.  
- The Ministry of Education struggles with promptly and effectively relaying information to all stakeholders, highlighting the need for a more streamlined notification system.  
## Functionality
- A unified website page for schools across all islands of Palau could serve as a centralized platform for announcements, updates, and important information.
- People can share their thought of the post and announcements in commend section.
- Effortlessly share the food calendar on the unified website.
- People can share their preferred foods in the food calendar to reduce the waste of the food.
- A centralized platform with two forms—meal counts and order placements—accessible from the main entry, and for efficient sharing of menus, announcements, and information.


# How to Deploy this website

This service is built with the MERN stack (MongoDB, Express, ReactJS, NodeJS), along with Nginx in a Docker Compose environment.

1. Revise the nginx.prod.conf, docker-compose.prod.yml and any relevant file to production (ex. server.js, dockerfile)
2. install the docker and docker compose in your cloud server
    
    ```bash
    sudo apt update
    sudo apt install docker.io docker-compose
    ```
    
3. upload the file into the cloud server
4. setting the website domain name
    
    ```bash
    export DOMAIN_NAME=your-domain.com
    # or add the DOMAIN_NAME in .env
    ```
    
5. start the service
    
    ```bash
    docker-compose -f docker-compose.prod.yml up -d
    ```
    

I suggest using HTTPS for this website to ensure security during account authorization and to prevent potential password leaks. However, since the account is centrally managed and not tied to personal passwords, the risk is minimal even if a leak occurs.
