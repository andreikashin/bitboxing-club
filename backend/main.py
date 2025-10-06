from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pynetbox, os

app = FastAPI(title="NetBox Device Adder")

NETBOX_URL = os.getenv("NETBOX_URL", "http://netbox:8080")
NETBOX_TOKEN = os.getenv("NETBOX_TOKEN", "")
nb = pynetbox.api(NETBOX_URL, token=NETBOX_TOKEN)

class DeviceIn(BaseModel):
    name: str
    role: str
    type: str
    site: str

@app.post("/devices/")
def add_device(dev: DeviceIn):
    try:
        site = nb.dcim.sites.get(name=dev.site) or nb.dcim.sites.create(name=dev.site, slug=dev.site.lower())
        role = nb.dcim.device_roles.get(name=dev.role) or nb.dcim.device_roles.create(name=dev.role, slug=dev.role.lower())
        dtype = nb.dcim.device_types.get(model=dev.type) or nb.dcim.device_types.create(model=dev.type, slug=dev.type.lower(), manufacturer={"name": "Generic", "slug": "generic"})
        device = nb.dcim.devices.create(name=dev.name, device_role=role.id, device_type=dtype.id, site=site.id)
        return {"status": "ok", "device": device.name}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
