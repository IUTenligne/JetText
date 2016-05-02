class Container < ActiveRecord::Base
  belongs_to :user
  has_many :pages, :dependent => :destroy
  has_many :uploads
  has_many :terms, :through => :containers_glossary

  validates :name,		:presence => true, length: { maximum: 250 }
  validates :content, 	:presence => false
  validates :user_id, 	:presence => true

  private
	  def create_folder
	    return nil unless current_user.present?
	    dest = "#{Rails.root}/public/#{current_user.email}"
	    FileUtils.mkdir_p dest
	    return dest
	  end
end

# == Schema Information
#
# Table name: containers
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  content    :binary(16777215)
#  url        :string(255)
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
