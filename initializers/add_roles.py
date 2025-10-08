import pynetbox
import os

# Connect to the local NetBox instance inside the container
netbox_url = 'http://localhost:8080'
# The token is passed as an environment variable
netbox_token = os.getenv('NETBOX_SUPERUSER_API_TOKEN')

nb = pynetbox.api(url=netbox_url, token=netbox_token)

# Data to be created
device_roles_to_create = [
    {'name': 'Core Switch', 'slug': 'core-switch', 'color': 'aa1409'},
    {'name': 'Access Switch', 'slug': 'access-switch', 'color': '2196f3'},
    {'name': 'Firewall', 'slug': 'firewall', 'color': 'f44336'},
    {'name': 'Server', 'slug': 'server', 'color': '4caf50'},
]

# Create the roles
for role_data in device_roles_to_create:
    if not nb.dcim.device_roles.get(name=role_data['name']):
        nb.dcim.device_roles.create(role_data)
        print(f"✅ Created device role: {role_data['name']}")