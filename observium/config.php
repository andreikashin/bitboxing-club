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
?>
