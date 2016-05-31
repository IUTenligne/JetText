class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :containers, dependent: :destroy   
  has_one :role    

  before_create :default_role

  def is_admin?
    admin = Role.where(name: "admin").take
    self.role_id == admin.id
  end

  private
    def default_role
      self.role_id ||= 1
    end
end

# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string(255)      default(""), not null
#  encrypted_password     :string(255)      default(""), not null
#  firstname              :string(255)      default(""), not null
#  lastname               :string(255)      default(""), not null
#  reset_password_token   :string(255)
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :integer
#  last_sign_in_ip        :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  provider               :string(255)      default("email"), not null
#  uid                    :string(255)      default(""), not null
#  authentication_token   :string(255)
#
