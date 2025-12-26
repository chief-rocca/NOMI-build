# NOMI MVP 📱
NOMI is a high-fidelity, cross-platform mobile application built with React Native and Expo. This MVP is engineered as a "Functional Shell" to demonstrate core user flows, hardware integration, and UI/UX fidelity as defined in the project wireframes.

📋 Project Scope (Clause 2.1 Compliance)
NOMI is designed to provide a realistic user experience without the overhead of a live backend.

Platform: iOS & Android (Cross-platform parity).

Authentication: High-fidelity Login/Sign-up UI featuring a simulated OTP (One-Time Pin) verification flow.

UI/UX: Pixel-perfect implementation of the provided wireframes.

Hardware Integration: Functional Biometric Login (FaceID/TouchID), Location services, and Permissions management.

Data Handling: Session-based only. The application utilizes local in-memory state. Data is maintained while the app is active but is reset upon app restart, ensuring a clean state for every demo session.

🛠 Tech Stack
Framework: Expo (SDK 52+)

Routing: Expo Router (Native file-based navigation)

Styling: NativeWind (Tailwind CSS for mobile)

State Management: Zustand (In-memory session store)

Hardware APIs: expo-local-authentication, expo-location, expo-haptics

🏗 Project Architecture
The architecture is structured to be "Simulation-First," making it easy to swap mock services for real APIs in the future.

Plaintext

NOMI/
├── app/                  # Expo Router (Navigation & Protected Routes)
├── src/
│   ├── components/       # UI Primitives (Buttons, Inputs, Modals)
│   ├── features/         # Domain logic (Auth, Location, Profile)
│   ├── services/         # The "Simulation Layer" (Async mock APIs)
│   ├── store/            # Zustand stores (Non-persistent session state)
│   ├── hooks/            # Hardware-specific logic (useBiometrics, etc.)
│   └── constants/        # App theme and static mock data
