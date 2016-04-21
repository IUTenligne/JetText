FactoryGirl.define do

  factory :container do
    name "Container 1"
    content "Content of container 1."
    url "random@random.random"
    association :user, factory: :user, lastname: "One"
  end

end
