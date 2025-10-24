# Planning Guide

An interactive bug hunting challenge that tests users' ability to identify functional issues in a seemingly normal task management application.

**Experience Qualities**:
1. **Playful** - The challenge should feel like a game, rewarding discovery and attention to detail
2. **Frustrating (intentionally)** - Bugs should be subtle enough to make users question if they found a real bug or just misunderstood the feature
3. **Satisfying** - Each bug discovery should provide clear feedback and progress toward completion

**Complexity Level**: Light Application (multiple features with basic state)
This is a deliberately broken task management app with a bug reporting overlay. It needs enough features to hide 10 functional bugs while remaining simple enough to explore completely.

## Essential Features

### Bug Counter Display
- **Functionality**: Shows "Find all 10 bugs!" at the top with current progress
- **Purpose**: Sets clear expectations and tracks user progress
- **Trigger**: Visible on page load
- **Progression**: Static display → Updates as bugs are found → Completion celebration
- **Success criteria**: Counter updates correctly, completion state triggers

### Task Management Interface
- **Functionality**: Add, complete, delete, and filter tasks
- **Purpose**: Provides the playground where bugs are hidden
- **Trigger**: User interacts with task list
- **Progression**: View tasks → Add new task → Mark complete → Filter/sort → Delete
- **Success criteria**: All interactions work (but with intentional bugs)

### Bug Reporting System
- **Functionality**: Users can report suspected bugs by describing what's wrong
- **Purpose**: Allows users to "submit" found bugs and get feedback
- **Trigger**: User clicks "Report a Bug" button
- **Progression**: Click report → Select bug category → Describe issue → Submit → Get validation feedback
- **Success criteria**: Successfully identifies if user found a real bug, updates counter

### Progress Tracking
- **Functionality**: Persists found bugs across sessions
- **Purpose**: Prevents frustration of losing progress on refresh
- **Trigger**: Bug is successfully identified
- **Progression**: Bug found → Save to storage → Update UI → Persist across reloads
- **Success criteria**: Progress survives page refresh

### Completion Celebration
- **Functionality**: Special UI when all 10 bugs are found
- **Purpose**: Reward completion and provide satisfaction
- **Trigger**: 10th bug is identified
- **Progression**: Last bug found → Celebration animation → Show all bugs list → Reset option
- **Success criteria**: Clear victory state with option to restart

## Edge Case Handling

- **Duplicate reports**: Users report the same bug twice - track already-found bugs and provide feedback
- **False positives**: Users report non-bugs as bugs - provide helpful feedback without giving away answers
- **Empty states**: No tasks exist - ensure bugs still testable
- **Reset capability**: Allow users to restart the challenge
- **Hint system**: Optional progressive hints for stuck users

## Design Direction

The design should feel playful yet professional, like a developer tool that doesn't take itself too seriously. It should embrace a "broken but charming" aesthetic where the bugs feel intentional rather than sloppy. The interface needs to be clean enough that bugs are discoverable through interaction rather than visual chaos.

## Color Selection

Triadic color scheme representing debugging/developer tools - using orange (warnings), blue (info), and green (success) to create an energetic, tool-like feeling.

- **Primary Color**: Deep Blue (oklch(0.45 0.15 250)) - Professional developer tool aesthetic, represents code and logic
- **Secondary Colors**: 
  - Warm Orange (oklch(0.65 0.15 45)) - Warning/bug indicators, creates energy
  - Mint Green (oklch(0.75 0.12 155)) - Success states, found bugs
- **Accent Color**: Bright Orange (oklch(0.70 0.18 40)) - Attention-grabbing for bug report button and important CTAs
- **Foreground/Background Pairings**:
  - Background (White oklch(0.98 0 0)): Dark foreground (oklch(0.25 0.02 250)) - Ratio 11.2:1 ✓
  - Card (Light Blue oklch(0.96 0.02 250)): Dark foreground (oklch(0.25 0.02 250)) - Ratio 10.8:1 ✓
  - Primary (Deep Blue oklch(0.45 0.15 250)): White text (oklch(0.98 0 0)) - Ratio 7.2:1 ✓
  - Secondary (Light Gray oklch(0.92 0.01 250)): Dark text (oklch(0.30 0.02 250)) - Ratio 9.5:1 ✓
  - Accent (Bright Orange oklch(0.70 0.18 40)): White text (oklch(0.98 0 0)) - Ratio 5.1:1 ✓
  - Muted (Soft Gray oklch(0.94 0.005 250)): Muted text (oklch(0.50 0.02 250)) - Ratio 6.8:1 ✓

## Font Selection

Typography should feel approachable and modern while maintaining the credibility of a developer tool. Using a clean sans-serif that's highly legible for both the challenge instructions and the intentionally buggy interface.

- **Typographic Hierarchy**:
  - H1 (Challenge Title): Inter Bold/32px/tight letter spacing - Commands attention
  - H2 (Section Headers): Inter Semibold/24px/normal spacing - Clear hierarchy
  - H3 (Bug Counter): Inter Medium/20px/wide spacing - Emphasizes game status
  - Body (Tasks & Instructions): Inter Regular/16px/relaxed line-height - Maximum readability
  - Caption (Bug hints): Inter Regular/14px/loose spacing - Subdued but clear
  - Button Labels: Inter Medium/15px/slight letter spacing - Clear call-to-action

## Animations

Subtle, purposeful animations that enhance bug discovery feedback without distracting from the challenge itself. Most animations should feel responsive and snappy like a developer tool.

- **Purposeful Meaning**: Quick, satisfying feedback for bug discoveries (checkmark animations), subtle shake for failed attempts, gentle pulse for interactive elements
- **Hierarchy of Movement**: 
  - High priority: Bug found celebration (confetti, success badge animation)
  - Medium priority: Task interactions (add, complete, delete with smooth transitions)
  - Low priority: Hover states and focus indicators (subtle scale/glow)

## Component Selection

- **Components**: 
  - Card: Task list container with subtle shadow
  - Button: Primary (Report Bug), Secondary (Add Task), Ghost (Task actions)
  - Checkbox: Task completion with custom styling
  - Input: Task entry field with validation
  - Badge: Bug counter and category tags
  - Dialog: Bug report modal with form
  - Tabs: Filter tasks (All, Active, Completed)
  - Progress: Visual progress bar for bug hunting
  - Alert: Success/error feedback for bug reports
  - Separator: Visual breaks between sections
  
- **Customizations**: 
  - Custom bug report button with icon and pulse animation
  - Task list with strikethrough animation for completed items
  - Progress indicator styled as debug console
  - Celebration confetti component for completion
  
- **States**: 
  - Buttons: Hover (subtle scale + glow), Active (pressed state), Disabled (grayed out for already-found bugs)
  - Inputs: Focus (border color change + shadow), Error (shake + red border), Success (green border)
  - Tasks: Default, Hover (background highlight), Completed (strikethrough + muted)
  - Bug Reports: Pending (loading spinner), Success (checkmark + green), Failed (x + red)
  
- **Icon Selection**: 
  - Bug (bug icon) - Main theme icon
  - Plus - Add task
  - Check - Complete task
  - Trash - Delete task
  - MagnifyingGlass - Inspect/report bug
  - ListBullets - All tasks filter
  - CheckCircle - Completed filter
  - Circle - Active filter
  
- **Spacing**: 
  - Container padding: p-6
  - Card padding: p-4
  - Section gaps: gap-6
  - Item gaps: gap-3
  - Button padding: px-4 py-2
  
- **Mobile**: 
  - Single column layout on mobile
  - Bottom sheet for bug reporting instead of centered dialog
  - Larger touch targets (min 44px)
  - Simplified task actions (swipe to delete option)
  - Sticky header with bug counter
