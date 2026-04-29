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

This is a collection of components meant to integrate Notifications into the platform UI. They are presently used in the `HeaderNotificationsSlot`_.

.. _HeaderNotificationsSlot: https://github.com/openedx/frontend-component-header/tree/master/src/plugin-slots/HeaderNotificationsSlot

Getting Started
===============

Configuration
---------------------

The components are added to logged-in MFEs when `tutor-contrib-platform-notifications`_ is used in a Tutor deployment.

.. _tutor-contrib-platform-notifications: https://github.com/openedx/tutor-contrib-platform-notifications

Local Development
-----------------

Clone this repository into your main workspace folder.

Insert the following into the ``env.config.js`` file of MFE. If it doesn't exist, create one
in the root and add the following configuration::


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

Contributions are very welcome.  Please read `How To Contribute`_ for details.

.. _How To Contribute: https://openedx.org/r/how-to-contribute

This project is currently accepting all types of contributions, bug fixes,
security fixes, maintenance work, or new features.  However, please make sure
to have a discussion about your new feature idea with the maintainers prior to
beginning development to maximize the chances of your change being accepted.
You can start a conversation by creating a new issue on this repo summarizing
your idea.

People
======

The assigned maintainers for this component and other project details may be
found in `Backstage`_. Backstage pulls this data from the ``catalog-info.yaml``
file in this repo.

.. _Backstage: https://open-edx-backstage.herokuapp.com/catalog/default/component/frontend-plugin-notifications


Reporting Security Issues
=========================

Please do not report security issues in public. Email security@openedx.org instead.
