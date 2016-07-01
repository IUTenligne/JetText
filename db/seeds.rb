=begin
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
	{role: "pending"},
	{role: "author"},
	{role: "expert"},
	{role: "staff"},
	{role: "admin"}
])

User.create!([
	{ firstname: "Admin", lastname: "Account", email: "root@jettext.com", password: "00000000", :password_confirmation => '00000000', validated: 1, role_id: 5 }
])
=end
Category.create!([
  {name: "économie"},
  {name: "gestion"},
  {name: "fiscalité"},
  {name: "comptabilité"},
  {name: "marketing"},
  {name: "droit"},
  {name: "mathématiques"},
  {name: "informatique"},
  {name: "électronique"},
  {name: "automatique"},
  {name: "mécanique"},
  {name: "optique"},
  {name: "réseaux"},
  {name: "télécommunications"},
  {name: "chimie"},
  {name: "électricité"},
  {name: "électrotechnique"},
  {name: "génie civil"},
  {name: "physique"},
  {name: "communication"},
  {name: "sciences du vivant"},
  {name: "histoire"},
  {name: "langues vivantes"},
  {name: "sciences politiques"},
  {name: "arts"},
  {name: "sciences du langage"},
  {name: "littérature"},
  {name: "médecine"},
  {name: "sciences de la santé"},
  {name: "pharmacie, pharmacologie"}
])

=begin
500.times do |i|
  r = Random.new

  Upload.create!([
  	name: "Upload #{i}",
    file_file_name: "bird.png",
    file_content_type: "image/png",
    file_file_size: 1354804,
    file_updated_at: "2016-06-15 10:53:09.#{i}",
    filetype: "image",
    url: "yaourtnut@gmail.com/files/image/2016-06/201606151207_bird.png",
    alt: "Texte descriptif de l'image",
    width: "200",
    user_id: 1
  ])
end
=end
