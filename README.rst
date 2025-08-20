frontend-plugin-notifications
#############################

|license-badge| |status-badge| |ci-badge| |codecov-badge|

.. |license-badge| image:: https://img.shields.io/badge/license-AGPL-informational
    :target: https://github.com/edx/frontend-plugin-notifications/blob/main/LICENSE
    :alt: License

.. |status-badge| image:: https://img.shields.io/badge/Status-Maintained-brightgreen

.. |ci-badge| image:: https://github.com/edx/frontend-plugin-notifications/actions/workflows/ci.yml/badge.svg
    :target: https://github.com/edx/frontend-plugin-notifications/actions/workflows/ci.yml
    :alt: Continuous Integration

.. |codecov-badge| image:: https://codecov.io/github/edx/frontend-plugin-notifications/coverage.svg?branch=main
    :target: https://codecov.io/github/edx/frontend-plugin-notifications?branch=main
    :alt: Codecov

Purpose
=======

This is the repository for storing Notification Tray frontend plugin. Intended to be used with
the `frontend-plugin-framework`_.

.. _frontend-plugin-framework: https://github.com/openedx/frontend-plugin-framework

Getting Started
===============

Devstack Installation
---------------------

This plugin is intended to be used with Header component. Make sure to follow the instructions on the MFE's
repository README for getting set up in a devstack.

Header in MFE should contain a plugin slot component to render the notifications tray.

Local Development
-----------------

Clone this repository into your main workspace folder.

Insert the following into the ``env.config.js`` file of MFE. If it doesn't exist, create one
in the root and add the following configuration::

```
// Imports from frontend-plugin-framework
import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';

// Import  plugin components from the npm package
import NotificationsTray from '@edx/frontend-plugin-notifications';

const config = {
  pluginSlots: {
    // Add configuration for each notifications_slot. This is the ID for the <PluginSlot> component
    notifications_tray: {
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'notifications_tray',
            type: DIRECT_PLUGIN,
            RenderWidget: NotificationsTray,
          },
        },
      ],
    },
  },
};
export default config;

```

To develop while using this plugin library, modify the ``module.config.js`` file in the root of the MFE you are
developing in to reference the local version of the plugin.::

module.exports = {
    localModules: [
        // Add the below object to the localModules array
        {
            moduleName: '@edx/frontend-plugin-notifications',
            dir: '../src/frontend-plugin-notifications',
            dist: 'dist'
        },
    ],
}


License
=======

The code in this repository is licensed under the AGPLv3 unless otherwise
noted.

Please see `LICENSE <LICENSE>`_ for details.

Contributing
============

Before considering whether or not something belongs in this repository, use the `plugins decision tree`_ to see ensure
it is the correct place.

.. _plugins decision tree: https://2u-internal.atlassian.net/wiki/spaces/microb/pages/597590081/Frontend+Plugin+Framework#Implementation

People
======

Contact @edx/edx-infinity if you are having any trouble developing in this repository.

Reporting Security Issues
=========================

Please do not report security issues in public. Email security@edx.org instead.
