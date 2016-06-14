#!/bin/sh

set -u # Undefined variables are errors

main() {
	global_check
}

global_check() {
	gpg_available=false

	# Check to see if GNUPG version 2 is installed, falling back to using version 1 by default
	gpg_exe=gpg
	if command -v gpg2 > /dev/null 2>&1; then
	    gpg_exe=gpg2
	fi
	if command -v "$gpg_exe" > /dev/null 2>&1; then
	    gpg_available=true
	fi

	git_available=false
	if command -v git >/dev/null 2>&1; then 
		git_available=true
	else
		echo >&2 "Git missing.";
		sudo bash -c 'apt-get -y install git >/dev/null 2>&1 & disown'
		git_available=true
	fi

	ffmpeg_available=false
	if command -v ffmpeg >/dev/null 2>&1; then
		ffmpeg_available=true
	else
		echo >&2 "FFMPEG missing.";
		git clone git://source.ffmpeg.org/ffmpeg.git ffmpeg
		./ffmpeg/configure && make && make install
		ffmpeg_available=true
	fi
}

main



#DUMP commands
#mysqldump --defaults-file=/etc/mysql/debian.cnf --no-create-db --no-create-info --ignore-table=jettext_dev.schema_migrations jettext_dev > /tmp/dumps/jettext-dump.sql
#mysql --defaults-file=/etc/mysql/debian.cnf jettext_dev < /tmp/dumps/jettext-dump.sql