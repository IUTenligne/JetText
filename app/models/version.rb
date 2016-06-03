class Version < ActiveRecord::Base
	belongs_to :container
	has_many :blocks

	private
		# Cron job called in config/shedule.rb
		# Create a new version of a container & blocks 
		# if any block.updated_at is sup than current version.created_at

		def self.check_updates
			containers = Container.all.where(visible: true).where(status: true)
			to_update = Array.new
			containers.map{ |container| 
				updated = false
				version = Version.where(container_id: container.id).last
				blocks = Block.where(version_id: version.id)
				blocks.map{ |block| updated = true if block.updated_at > version.created_at }
				to_update.push(container) if updated === true
			}
			return to_update
		end

		def self.create_version
			containers = self.check_updates
			containers.map{ |container|
		    prev_version = Version.where(container_id: container.id).last
		    version = Version.new(container_id: container.id)
		    version.save!

		    pages = Page.where(:container_id => container.id)
		    pages.each.map{ |page|
		      blocks = Block.where(:page_id => page.id).where(:version_id => prev_version.id)
		      blocks.map{ |block|
		        new_block = block.dup
		        new_block.version_id = version.id
		        new_block.save!
		      }
		    }

		    # Send update email
   			UserMailer.container_update_message(container).deliver
		  }
		end
end
