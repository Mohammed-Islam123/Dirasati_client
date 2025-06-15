# Product Context: User Experience and Feature States

## User Flow

1. **Unauthenticated Users**:

   - Land on the marketing/landing page (Home component)
   - Can navigate to login or registration pages
   - Access to general information about the platform

2. **Authenticated Users**:
   - Directed to role-specific dashboards based on their credentials
   - Access to features and views specific to their roles
   - JWT token stored in localStorage (or context) determines auth state

## Core Features (Based on README)

### Student & Enrollment Management

- Student profile creation and updates
- Enrollment and re-enrollment management
- Document archiving and academic history tracking

### Attendance Tracking

- Automated attendance
- Real-time absence notifications to parents
- Absence reports and statistics

### Timetable Management

- Automated timetable generation
- Real-time scheduling changes
- Online timetable access

### Payment & Accounting

- Automated tuition fee invoicing
- Payment tracking and alerts
- Online payment integration

### Parent & Teacher Communication

- Web portals for communication
- Notifications and announcements
- Integrated messaging

## Landing Page Requirements

- Visual representation of the platform's capabilities
- Clear CTAs for signup and login
- Feature highlights explaining core value proposition
- Modern, responsive design with blue + white color scheme
- Shows only when user is not authenticated
