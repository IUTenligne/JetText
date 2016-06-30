class Container < ActiveRecord::Base
  belongs_to :user
  has_many :pages, :dependent => :destroy
  has_many :uploads
  has_many :glossaries, :through => :containers_glossary
  has_many :categories
  has_many :versions
  has_and_belongs_to_many :companies, :through => :companies_container
  has_and_belongs_to_many :categories, :through => :categories_container

  validates :name,		  :presence => true, length: { maximum: 250 }
  validates :content, 	:presence => false
  validates :user_id, 	:presence => true

  before_create :default_values

  attr_accessor :cats

  def set_categories(id)
    self.categories = Category.select("id, name").where(:id => CategoriesContainer.select("category_id").where(:container_id => id))
  end

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
