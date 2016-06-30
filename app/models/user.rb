class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauthable, :omniauth_providers => [:facebook, :google_oauth2]

  has_many :containers, dependent: :destroy
  belongs_to :role

  before_create :default_values
  before_create :create_user_dir
  after_create :welcome_message

  def is_admin?
    admin = Role.where(role: "admin").take
    self.role_id == admin.id
  end

  def is_validated?
    return true if self.validated == true
    return false
  end

  def is_expert?
    expert = Role.where(role: "expert").take
    self.role_id == expert.id
  end

  def welcome_message
    UserMailer.welcome_message(self).deliver
    UserMailer.new_user_adminmessage(self).deliver
  end

  def self.validation_message
    UserMailer.validation_message(self).deliver
  end

  private
    def self.from_omniauth(auth)
      where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
        user.email = auth.info.email
        user.password = Devise.friendly_token[0,20]
        unless auth.info.first_name.nil?
          user.firstname = auth.info.first_name
        else
          user.firstname = auth.info.name
        end
        user.lastname = auth.info.last_name unless auth.info.last_name.nil?
        user.image = auth.info.image unless auth.info.image.nil?
      end
    end

    def default_values
      self.validated = false
      self.role_id ||= 1
    end

    def create_user_dir
      FileUtils.mkdir_p "#{Rails.root}/public/#{self.email}"
    end

    def self.users_list
      return User.all
        .select("
          users.id,
          users.firstname,
          users.lastname,
          users.email,
          users.created_at,
          users.role_id")
        .joins(:role)
        .select("roles.role")
        .where("role NOT LIKE 'admin'")
    end
end
