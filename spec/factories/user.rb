FactoryGirl.define do

	factory :user do
    firstname "John"
    lastname  "Doe"
    email "john.doe@example.test"
    password "TestPw8char"
    validated true
    role_id 1
  end

end
