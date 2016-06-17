
Type.create!([ 
  {name: "Texte", created_at: "2016-19-04 09:00:00.972419", updated_at: "2016-19-04 09:00:00.972419"},
  {name: "Media", created_at: "2016-19-04 09:00:00.972419", updated_at: "2016-19-04 09:00:00.972419"},
  {name: "Remarque", created_at: "2016-19-04 09:00:00.972419", updated_at: "2016-19-04 09:00:00.972419"},
  {name: "Maths", created_at: "2016-19-04 09:00:00.972419", updated_at: "2016-19-04 09:00:00.972419"}
])

Company.create!([ 
	{name: "IUTenLigne"}
])

Role.create!([ 
	{role: "Pending"},
	{role: "Auteur"},
	{role: "Expert"},
	{role: "Staff"},
	{role: "Admin"}
])


=begin
1000.times do |i|
  r = Random.new      

  Upload.create!([
  	name: "Upload #{i}", 
    file_file_name: "giphy.gif",
    file_content_type: "image/gif",
    file_file_size: 1354804,
    file_updated_at: "2016-06-15 10:53:09.#{i}",
    filetype: "image",
    url: "pierre.duverneix@iut.fr/files/image/2016-06/201606151253_giphy.gif",
    alt: "Texte descriptif de l'image",
    width: "200",
    user_id: 1
  ])
end
=end