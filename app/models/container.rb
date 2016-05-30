class Container < ActiveRecord::Base
  belongs_to :user
  has_many :pages, :dependent => :destroy
  has_many :uploads
  has_many :glossaries, :through => :containers_glossary
  has_and_belongs_to_many :companies, :through => :companies_container

  validates :name,		:presence => true, length: { maximum: 250 }
  validates :content, 	:presence => false
  validates :user_id, 	:presence => true

  before_save :default_values
  
  private
	  def create_folder
	    return nil unless current_user.present?
	    dest = "#{Rails.root}/public/#{current_user.email}"
	    FileUtils.mkdir_p dest
	    return dest
	  end

    def default_values
      self.visible ||= 1
      self.status ||= 0
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
