---
layout: minimal
title: Projects
description: &desc Project instructions and specifications.
summary: *desc
has_children: true
has_toc: true
parent: CSE 373
permalink: /:path/
---

# {{ page.title }}
{: .no_toc .mb-2 }

{{ page.description }}
{: .fs-6 .fw-300 }

1. TOC
{:toc}

## Deques Setup

### Install Git

Git is a **version control system** (VCS), a tool for distributing, managing, and sharing code with other people. Install Git by following the instructions according to your computer's operating system.

Windows
: [Download and install Git](https://git-scm.com/download/win). All the default settings will work.

macOS
: From Finder, navigate to **Application \| Utilities \| Terminal**. Type `git --version` into the terminal and press `Enter`. If you see a download prompt, follow the instructions.

ChromeOS
: At the bottom right, select the time. Then, select **Settings \| Advanced \| Developers** and **Turn On** the Linux development environment. Finally, follow the Linux instructions for all remaining setup.

Linux
: Install `git` using your package manager. On Debian, Ubuntu, or other apt-managed systems, type `sudo apt install git` into the terminal and press `Enter`.

{: .hint }
The `sudo` command may require a password prompt. When you type into the password prompt, nothing will appear. This is a security feature: your typing is intentionally hidden!

### Install IntelliJ

[Download and install the latest version of IntelliJ IDEA Community Edition](https://www.jetbrains.com/idea/download/) for your computer's operating system. IntelliJ is an integrated development environment that is helpful for writing complex programs that span multiple Java classes. Open the [Standalone installation](https://www.jetbrains.com/help/idea/installation-guide.html#standalone) guide, select your computer's operating system, and follow the steps.

Once IntelliJ is installed, [run IntelliJ IDEA](https://www.jetbrains.com/help/idea/run-for-the-first-time.html) and select **Skip Remaining and Set Defaults**. You should see the **Welcome to IntelliJ IDEA** screen.

![Welcome screen](https://resources.jetbrains.com/help/img/idea/2022.3/ij_welcome_window.png)

Now that you've installed IntelliJ, select **Customize** from the sidebar and then choose **All settings...** at the bottom to open a new window. Under **Appearance & Behavior \| New UI**, choose **Enable new UI**, press **OK** and restart IntelliJ. Once you're back at the **Welcome to IntelliJ IDEA** screen, select **Plugins** from the sidebar, search for "jGRASP", and then install the **jGRASP** plugin.

### Obtain and run project code

From the **Welcome to IntelliJ IDEA** screen, select **Projects** from the sidebar and then **Get from VCS**. Paste the following URL, choose a place to enter, and clone the project code repository.

{: .note }
<https://github.com/kevinlin1/deques.git>

The first time you open the project, IntelliJ will ask you whether to [trust the project](https://www.jetbrains.com/help/idea/project-security.html). Choose **Trust Project** so that IntelliJ has your permission to run code.

After a few seconds, IntelliJ will open the main editor screen. Let's try running a class in IntelliJ:

<video controls muted class="module full-width" style="aspect-ratio: 16/10"><source src="{{ site.baseurl }}{% link assets/videos/run-browserhistory.webm %}" type="video/webm"></video>

1. Look at the left side of the screen for the **Project** tool window that shows all the files in the project.
1. In the project tool window, double-click to open the **src** folder.
1. In the open folder, double-click the **© BrowserHistory** class. The © icon to its left indicates that it's a Java class.
1. In the new tab for the `BrowserHistory` class, click the green play ▶️ in the gutter. In the dropdown, select the option to **Run 'BrowserHistory.main()'**.

If you see the following output in the run tool window, you're all set!

```
uw.edu my.uw.edu cs.uw.edu canvas.uw.edu
cs.uw.edu notify.uw.edu
```

Most of the project design and implementation work will happen in the **deques** folder nested within the **src** folder, so try opening the `ArrayDeque` class to get started.

<details markdown="block">
<summary>My computer doesn't display the expected output!</summary>

If you're instead seeing a "Cannot start compiler" notification with a suggestion to configure the Project SDK. Follow the link in the notification, or from the main menu select **File \| Project Structure**. In the **Project Structure** window, open the **SDK** dropdown.

![Change the project SDK](https://resources.jetbrains.com/help/img/idea/2022.3/sdks_project_structure_project.png)

If IntelliJ detected an existing Java SDK, it will be listed under **Detected SDKs**.

- If an SDK version 11 or greater is available, select it.
- Otherwise, select **Add SDK \| Download JDK** and choose the latest from any vendor.

Click **OK** and try running `BrowserHistory` again. It should work now!
</details>

## Husky Maps Setup

The remaining setup only applies to the Husky Maps case study that begins after the conclusion of the Deques project. After we've organized project teams, the staff will create a **private repository** for each team. This requires some additional setup.

<details markdown="block">
<summary>What if I'm not enrolled in CSE 373?</summary>

From the **Welcome to IntelliJ IDEA** screen, select **Projects** from the sidebar and then **Get from VCS**. Paste the following URL.

{: .note }
<https://github.com/kevinlin1/huskymaps.git>

This obtains a public copy of Husky Maps, which doesn't allow for team collaboration.
</details>

### Generate SSH keys

Your private repository will be hosted on CSE GitLab, a service provided by the Allen School to securely and privately store your coursework. CSE GitLab requires SSH keys, which are computer-generated passwords used to securely authenticate your computer to CSE GitLab.

1. In IntelliJ, [open the Terminal tool window](https://www.jetbrains.com/help/idea/terminal-emulator.html#open-terminal).
2. In the terminal, generate an SSH key pair with the command `ssh-keygen -t ed25519`
3. At each prompt, press `Enter` to continue and accept the default settings.
4. Copy your public SSH key with the command `cat ~/.ssh/id_ed25519.pub`
5. In your browser, sign into [CSE GitLab](https://gitlab.cs.washington.edu/users/sign_in) using your UW NetID.
6. Visit the [SSH Keys user settings](https://gitlab.cs.washington.edu/-/profile/keys) and paste the public SSH key in the **Key** field.
7. Give it a title if it doesn't already have one and then press **Add key**.

### Obtain and run Husky Maps

After you have access to your team's private repository, you can get a copy of Husky Maps by cloning it from CSE GitLab.

1. Visit [CSE GitLab](https://gitlab.cs.washington.edu/) and you'll be greeted by a repository named with the name `huskymaps` and your project team identifier. This is your team's private repository and the repository that we'll be cloning today.
2. Open your private repository, press the blue **Clone** button, and copy the **Clone with SSH** address. Don't copy the "Clone with HTTPS" address! The correct address should begin with `git@`.
3. In IntelliJ, close the Deques project by selecting **File \| Close Project** from the main menu. From the welcome window, select **Get from VCS**. Paste your SSH address and choose a directory to store your private repository.
4. If you see an **SSH Confirmation** window pop-up, check that the fingerprint matches the [CSE GitLab fingerprint](https://gitlab.cs.washington.edu/help/instance_configuration). Compare the value to the table entry ED25519 SHA 256.
5. Once IntelliJ finishes cloning your repository, a new window will ask if you trust the project. We'll need to trust the project in order to run code.

At this point, you should be able to run the `MapServer` class (located in the `src` folder), which will launch the Husky Maps web app. If everything is successful, you'll see this flurry of messages appear in the Run tool window indicating that the app has launched.

```
[main] INFO io.javalin.Javalin - Starting Javalin ...
[main] INFO org.eclipse.jetty.server.Server - jetty-11.0.13; built: 2022-12-07T20:47:15.149Z; git: a04bd1ccf844cf9bebc12129335d7493111cbff6; jvm 11.0.16+8-post-Debian-1deb11u1
[main] INFO org.eclipse.jetty.server.session.DefaultSessionIdManager - Session workerName=node0
[main] INFO org.eclipse.jetty.server.handler.ContextHandler - Started i.j.j.@683dbc2c{/,null,AVAILABLE}
[main] INFO org.eclipse.jetty.server.AbstractConnector - Started ServerConnector@2b6856dd{HTTP/1.1, (http/1.1)}{0.0.0.0:8080}
[main] INFO org.eclipse.jetty.server.Server - Started Server@3c72f59f{STARTING}[11.0.13,sto=0] @4349ms
[main] INFO io.javalin.Javalin - 
       __                  ___          ______
      / /___ __   ______ _/ (_)___     / ____/
 __  / / __ `/ | / / __ `/ / / __ \   /___ \
/ /_/ / /_/ /| |/ / /_/ / / / / / /  ____/ /
\____/\__,_/ |___/\__,_/_/_/_/ /_/  /_____/

       https://javalin.io/documentation

[main] INFO io.javalin.Javalin - Listening on http://localhost:8080/
[main] INFO io.javalin.Javalin - You are running Javalin 5.3.1 (released January 8, 2023).
[main] INFO io.javalin.Javalin - Javalin started in 309ms \o/
```

You're done! All the app features work because we've provided reference implementations for each interface that we'll learn in this class. The goal of this approach is to enable you to compare different ways to implement the same functionality, each with their own trade-offs. Through studying interfaces and implementations, we'll gain a deeper understanding about why programs are designed the way they are.

You can now visit [localhost:8080](http://localhost:8080/) to try the web app for yourself, but the map images won't load without the optional steps below.

<details markdown="block">
<summary>How do I enable map images in Husky Maps?</summary>

To see the map images, [sign up for a free MapBox account](https://account.mapbox.com/auth/signup/?route-to=%22https://account.mapbox.com/access-tokens/%22) to get an access token. Once you have your access token, in the IntelliJ toolbar, select the "MapServer" dropdown, **Edit Configurations...**, under **Environment variables** write `TOKEN=` and then paste your token. Re-run the `MapServer` class to launch the web app and enjoy the ["Ice Cream" map style by Maya Gao](https://www.mapbox.com/gallery/).
</details>

<details markdown="block">
<summary>How do I let other people visit my Husky Maps?</summary>

Running Husky Maps in IntelliJ will only allow you (or whoever is using your computer) to access the app. In order to allow anyone on the internet to use your app, we'll need to deploy it to the web.

One way to share Java apps is by distributing them as a **JAR** that bundles all your code together into a single file.

1. Open IntelliJ. From the **File** menu, select **Project Structure...** and **Artifacts** from the sidebar.
2. Press the **+** button to add a new **JAR** and select **From module with dependencies**.
3. In the pop-up window, select **MapServer** as the main class and press **OK**.
4. Edit the name from "huskymaps:jar" to "huskymaps" and press **OK** to close the project structure dialog.
5. From the **Build** menu, select **Build Artifacts** and build **huskymaps**.
6. Test your JAR by running it from the terminal. In IntelliJ, [open the terminal](https://www.jetbrains.com/help/idea/terminal-emulator.html#open-terminal), and run `TOKEN=... java -jar out/artifacts/huskymaps/huskymaps.jar`.

To deploy the app to the web, we'll share this JAR file with a web hosting provider such as [fly.io](https://fly.io/). [Fly](https://fly.io/) provides a free web hosting service where anyone can sign-up to deploy their apps to the internet at no cost (no payment method needed).

1. [Install flyctl](https://fly.io/docs/hands-on/install-flyctl/) and [sign up](https://fly.io/docs/hands-on/sign-up/).
2. Start (but don't complete!) the process for [deploying your application via Dockerfile](https://fly.io/docs/languages-and-frameworks/dockerfile/). For the app name, use the name `huskymaps-` with your UW NetID after the dash. When it asks you to deploy, don't do so just yet!
3. Open the `fly.toml` file in a text editor and set the `force_https` option to false.
4. Share your MapBox access token with fly as an app secret with the terminal command `fly secrets set TOKEN=...`.
5. Finally, deploy the app with the terminal command `fly deploy`.
</details>
