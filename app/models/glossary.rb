class Glossary < ActiveRecord::Base
  belongs_to :user
  has_and_belongs_to_many :pages, :through => :pages_glossaries
end

# == Schema Information
#
# Table name: glossaries
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  description :text(65535)
#  user_id     :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
