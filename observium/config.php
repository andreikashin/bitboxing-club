<?php
$config['db_host'] = getenv('OBS_DB_HOST') ?: 'observium-mysql';
$config['db_user'] = getenv('OBS_DB_USER') ?: 'observium';
$config['db_pass'] = getenv('OBS_DB_PASS') ?: 'observium';
$config['db_name'] = getenv('OBS_DB_NAME') ?: 'observium';
$config['base_url'] = '/';
$config['auth_mechanism'] = 'mysql';
$config['fping'] = "/usr/bin/fping";
$config['rrdtool'] = "/usr/bin/rrdtool";
$config['rrd_dir'] = "/opt/observium/rrd";
$config['log_dir'] = "/opt/observium/logs";
$config['snmp']['community'] = array('public');

// --- NetBox Integration ---
$config['netbox']['api']['url'] = 'http://netbox/';
$config['netbox']['api']['token'] = '1234567890123456789012345678901234567890';

// Optional: If your NetBox uses a self-signed SSL certificate
// $config['netbox']['api']['ssl_verify'] = FALSE;

// Tell Observium to use NetBox for auto-discovery
$config['autodiscovery']['netbox'] = TRUE;

// Optional: Map NetBox device roles to Observium device types (case-sensitive)
// This helps Observium categorize devices correctly.
$config['netbox']['role_map'] = array(
  'Core Switch'    => 'core',
  'Access Switch'  => 'switch',
  'Firewall'       => 'firewall',
  'Router'         => 'router',
  'Server'         => 'server',
);
?>
