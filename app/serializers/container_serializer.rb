class ContainerSerializer < ActiveModel::Serializer
  attributes  :id,
  						:name,
  						:content,
  						:url,
  						:user_id
end
