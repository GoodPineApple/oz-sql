// Load environment variables first
require('dotenv').config();

// Import sequelize instance and model
var sequelize = require('../util/db');
var DesignTemplates = require('../models/designTemplates');

// Mock design templates data
const mockTemplates = [
  {
    name: 'Classic White',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    borderStyle: '1px solid #e0e0e0',
    shadowStyle: '0 2px 8px rgba(0,0,0,0.1)',
    preview: '🎨'
  },
  {
    name: 'Dark Theme',
    backgroundColor: '#2c3e50',
    textColor: '#ecf0f1',
    borderStyle: '1px solid #34495e',
    shadowStyle: '0 4px 12px rgba(0,0,0,0.3)',
    preview: '🌙'
  },
  {
    name: 'Warm Beige',
    backgroundColor: '#f5f5dc',
    textColor: '#8b4513',
    borderStyle: '2px solid #d2b48c',
    shadowStyle: '0 3px 10px rgba(139,69,19,0.2)',
    preview: '☕'
  },
  {
    name: 'Ocean Blue',
    backgroundColor: '#e8f4f8',
    textColor: '#2c3e50',
    borderStyle: '1px solid #3498db',
    shadowStyle: '0 2px 8px rgba(52,152,219,0.2)',
    preview: '🌊'
  }
];

// Seed design templates
async function seedDesignTemplates() {
  try {
    console.log('Starting to seed design templates...');
    
    // Check if templates already exist
    const existingTemplates = await DesignTemplates.findAll();
    if (existingTemplates.length > 0) {
      console.log(`Found ${existingTemplates.length} existing templates.`);
      console.log('Do you want to continue? This will add new templates...');
    }
    
    // Create templates
    for (const templateData of mockTemplates) {
      try {
        // Check if template with same name already exists
        const existingTemplate = await DesignTemplates.findOne({ 
          where: { name: templateData.name } 
        });
        
        if (existingTemplate) {
          console.log(`Template "${templateData.name}" already exists, skipping...`);
          continue;
        }
        
        // Create new template
        const template = await DesignTemplates.create(templateData);
        console.log(`✅ Created template: ${template.name} (ID: ${template.id})`);
      } catch (error) {
        console.error(`❌ Error creating template "${templateData.name}":`, error.message);
      }
    }
    
    // Display final count
    const finalCount = await DesignTemplates.count();
    console.log(`\n🎉 Seeding completed! Total templates in database: ${finalCount}`);
    
    // Display all templates
    const allTemplates = await DesignTemplates.findAll({
      order: [['id', 'ASC']]
    });
    
    console.log('\n📋 All design templates:');
    allTemplates.forEach(template => {
      console.log(`  ${template.id}. ${template.name} ${template.preview}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding design templates:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDesignTemplates();
