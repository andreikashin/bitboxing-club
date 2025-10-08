from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pynetbox, os

NETBOX_URL = os.getenv("NETBOX_URL", "http://netbox:8080")
NETBOX_TOKEN = os.getenv("NETBOX_TOKEN", "")

nb = pynetbox.api(NETBOX_URL, token=NETBOX_TOKEN)
app = FastAPI(title="NetBox Device Adder")

# --- Pydantic Models ---
class DeviceData(BaseModel):
    name: str
    device_role_slug: str
    device_type_slug: str
    site_slug: str
    status: str = "active"

class DeviceIn(BaseModel):
    name: str
    role: str
    type: str
    site: str

# --- API Endpoints ---
@app.post("/add-device/")
def add_device(device: DeviceData):
    """
        Receives device data from the frontend and creates the device in NetBox.
    """
    try:
        # Look up the IDs for the role, type, and site using their slugs
        device_role = nb.dcim.device_roles.get(slug=device.device_role_slug)
        device_type = nb.dcim.device_types.get(slug=device.device_type_slug)
        site = nb.dcim.sites.get(slug=device.site_slug)

        # Check if any of the required objects were not found
        if not all([device_role, device_type, site]):
            raise HTTPException(status_code=404, detail="Role, Type, or Site not found in NetBox.")

        # Create the new device in NetBox
        new_device = nb.dcim.devices.create(
            name=device.name,
            device_role=device_role.id,
            device_type=device_type.id,
            site=site.id,
            status=device.status,
        )
        print(f"✅ Successfully created device: {new_device.name}")
        return {"message": "Device created successfully", "device_id": new_device.id}

    except pynetbox.RequestError as e:
        # Handle errors from the NetBox API
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Handle other unexpected errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")


@app.post("/devices/")
def add_device_in(dev: DeviceIn):
    try:
        site = nb.dcim.sites.get(name=dev.site) or nb.dcim.sites.create(name=dev.site, slug=dev.site.lower())
        role = nb.dcim.device_roles.get(name=dev.role) or nb.dcim.device_roles.create(name=dev.role, slug=dev.role.lower())
        dtype = nb.dcim.device_types.get(model=dev.type) or nb.dcim.device_types.create(model=dev.type, slug=dev.type.lower(), manufacturer={"name": "Generic", "slug": "generic"})
        device = nb.dcim.devices.create(name=dev.name, device_role=role.id, device_type=dtype.id, site=site.id)
        return {"status": "ok", "device": device.name}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/device-roles/")
def get_device_roles():
    """
        Fetches all device roles from NetBox and returns them.
    """
    try:
        # Fetch all device role objects from NetBox
        roles = nb.dcim.device_roles.all()
        # Format the data into a simple list of objects for the UI
        role_list = [{"name": role.name, "slug": role.slug} for role in roles]
        return role_list
    except Exception as e:
        print(f"token={NETBOX_URL}")
        print(f"token={NETBOX_TOKEN}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch roles: {e}")
