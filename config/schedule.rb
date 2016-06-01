# Use this file to easily define all of your cron jobs.
# Learn more: http://github.com/javan/whenever

job_type :runner,  "cd :path && bin/rails runner -e development ':task' :output"

every 1.minutes do
  runner "Version.create_version"
end