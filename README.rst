frontend-app-notifications
##########################

|license-badge| |status-badge| |ci-badge| |codecov-badge|

.. |license-badge| image:: https://img.shields.io/badge/license-AGPL-informational
    :target: https://github.com/openedx/frontend-plugin-notifications/blob/main/LICENSE
    :alt: License

.. |status-badge| image:: https://img.shields.io/badge/Status-Maintained-brightgreen

.. |ci-badge| image:: https://github.com/openedx/frontend-plugin-notifications/actions/workflows/ci.yml/badge.svg
    :target: https://github.com/openedx/frontend-plugin-notifications/actions/workflows/ci.yml
    :alt: Continuous Integration

.. |codecov-badge| image:: https://codecov.io/github/openedx/frontend-plugin-notifications/coverage.svg?branch=main
    :target: https://codecov.io/github/openedx/frontend-plugin-notifications?branch=main
    :alt: Codecov

Purpose
=======

This repository hosts ``@openedx/frontend-app-notifications``, the Open edX
notifications frontend app. It is consumed by sites built on
`@openedx/frontend-base`_ and contributes a notifications bell widget to the
unified header's desktop and mobile right slots.

.. _@openedx/frontend-base: https://github.com/openedx/frontend-base

Getting Started
===============

Installation
------------

Install the package into a site that uses ``@openedx/frontend-base``::

    npm install @openedx/frontend-app-notifications

Then register the app's default export alongside the other ``App`` configs in
your ``site.config.*.tsx``::

    import notificationsApp from '@openedx/frontend-app-notifications';
    import { shellApp, headerApp, footerApp } from '@openedx/frontend-base';

    const config: SiteConfig = {
      // ...
      apps: [shellApp, headerApp, footerApp, notificationsApp],
    };

    export default config;

Named exports (``NotificationsTray``, ``Notifications``, ``useAppNotifications``,
``useNotification``) remain available for consumers that embed the tray or its
hooks directly.

Local Development
-----------------

Clone this repository and install dependencies::

    npm install

Run the bundled dev site (shell + header + footer + this app)::

    npm run dev

To develop against a local ``frontend-base`` checkout, bind-mount it into the
workspace and run the packages-aware dev script. See the ``Makefile`` for the
``dev-packages`` and ``bin-link`` targets.

License
=======

The code in this repository is licensed under the AGPLv3 unless otherwise
noted.

Please see `LICENSE <LICENSE>`_ for details.

Contributing
============

Contributions are welcome. Please open an issue or pull request on GitHub.

People
======

Contact @edx/edx-infinity if you are having any trouble developing in this repository.

Reporting Security Issues
=========================

Please do not report security issues in public. Email security@openedx.org instead.
