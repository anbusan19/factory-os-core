# Data Generation Scripts

This directory contains various scripts for generating synthetic data for the Factory OS Core application.

## Available Scripts

### 1. `seedData.js` (Original)
The original data seeding script with basic synthetic data.

```bash
npm run seed
```

### 2. `insertSyntheticData.js` (Enhanced)
An enhanced version with more comprehensive synthetic data including:
- More realistic machine configurations
- Experienced workforce with skills
- Historical production data
- Better data relationships

```bash
npm run seed:new
```

### 3. `generateDataScenarios.js` (High Performance)
Generates a high-performance factory scenario with:
- High-efficiency machines
- Experienced workers
- Minimal safety issues
- Positive system events
- Successful orders

```bash
npm run seed:scenarios
```

### 4. `dataGenerator.js` (Configurable)
A flexible data generator that supports multiple scenarios:

#### Available Scenarios:

**Normal Factory** (Default)
```bash
npm run seed:normal
```
- Balanced performance metrics
- Mix of machine statuses
- Realistic worker distribution
- Standard production levels

**High Performance Factory**
```bash
npm run seed:high-performance
```
- High-efficiency machines (90-98%)
- Experienced workers (low risk)
- Minimal safety alerts
- High production output
- Successful orders

**Struggling Factory**
```bash
npm run seed:struggling
```
- Many machines in fault/maintenance
- High worker risk indices
- Many safety alerts
- Low production output
- Failed orders

**Startup Factory**
```bash
npm run seed:startup
```
- Small number of machines/workers
- Limited production data
- Basic operations
- Growing business scenario

## Custom Data Generation

You can also run the data generator with custom parameters:

```bash
# Generate normal scenario with data clearing
node scripts/dataGenerator.js normal --clear

# Generate high performance scenario
node scripts/dataGenerator.js highPerformance --clear

# Generate struggling scenario
node scripts/dataGenerator.js struggling --clear

# Generate startup scenario
node scripts/dataGenerator.js startup --clear
```

## Data Generated

Each script generates the following data types:

### Machines
- Machine ID, name, status
- Position coordinates (x, y, z)
- Temperature and efficiency metrics
- Maintenance history

### Workers
- Worker ID, name, status
- Risk index and experience level
- Department and shift assignment
- Machine assignments
- Skills and training

### Safety Alerts
- Alert type (critical, warning, info)
- Severity levels
- Machine and worker associations
- Resolution status
- Timestamps

### System Events
- Event types (machine, worker, quality, etc.)
- Severity levels
- Associated entities
- Timestamps

### Orders
- Procurement orders (raw materials)
- Factory orders (manufacturing)
- Status tracking
- Payment information
- Quality scores

### Production Data
- Hourly production metrics
- Defect tracking
- Efficiency measurements
- Quality scores
- Shift-based data

## Configuration Options

The `dataGenerator.js` script supports various configuration options:

- **Machine Count**: Number of machines to generate
- **Worker Count**: Number of workers to generate
- **Alert Count**: Number of safety alerts
- **Event Count**: Number of system events
- **Production Days**: Days of production data to generate
- **Status Distributions**: Custom status distributions
- **Performance Ranges**: Custom efficiency and quality ranges

## Usage Examples

```bash
# Clear database and generate normal scenario
npm run seed:normal

# Generate high-performance scenario
npm run seed:high-performance

# Generate struggling factory scenario
npm run seed:struggling

# Generate startup scenario
npm run seed:startup
```

## Data Relationships

The scripts ensure proper relationships between data:
- Workers are assigned to machines based on department and status
- Safety alerts reference specific machines and workers
- System events are linked to relevant entities
- Production data includes machine and shift information
- Orders have realistic status progressions

## Historical Data

Some scripts generate historical data to show:
- Performance trends over time
- Improvement patterns
- Seasonal variations
- Growth trajectories

This provides realistic analytics data for dashboard visualizations and reporting.

## Notes

- All scripts use Faker.js for realistic data generation
- Data is generated with proper timestamps
- Relationships between entities are maintained
- Scripts can be run multiple times (with `--clear` flag)
- Generated data is suitable for testing and development
