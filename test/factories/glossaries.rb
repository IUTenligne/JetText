FactoryGirl.define do
  factory :glossary do
    name "MyString"
    description "MyText"
    user nil
  end
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
