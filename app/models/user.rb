class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :containers, dependent: :destroy   
  has_one :role    

  before_create :default_values

  def is_admin?
    admin = Role.where(name: "admin").take
    self.role_id == admin.id
  end

  def is_validated?
    return true if self.validated == true
    return false
  end

  private
    def default_values
      self.validated = false
      self.role_id ||= 1
    end
end