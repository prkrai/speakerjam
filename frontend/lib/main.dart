import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'sync_diagnostics_screen.dart';

void main() {
  runApp(const ProviderScope(child: SyncJamApp()));
}

class SyncJamApp extends StatelessWidget {
  const SyncJamApp({super.key});

  @override
  Widget build(BuildContext context) {
    final router = GoRouter(routes: [
      GoRoute(path: '/', builder: (context, state) => const HomeScreen()),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(path: '/register', builder: (context, state) => const RegisterScreen()),
      GoRoute(path: '/room', builder: (context, state) => const RoomScreen()),
      GoRoute(path: '/upload', builder: (context, state) => const UploadScreen()),
      GoRoute(path: '/diagnostics', builder: (context, state) => const SyncDiagnosticsScreen()),
    ]);

    return MaterialApp.router(routerConfig: router, title: 'SyncJam');
  }
}

class HomeScreen extends StatelessWidget { const HomeScreen({super.key}); @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('SyncJam')), body: const Center(child: Text('Create Room / Join Room'))); }
class LoginScreen extends StatelessWidget { const LoginScreen({super.key}); @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Login')), body: const Center(child: Text('Login screen'))); }
class RegisterScreen extends StatelessWidget { const RegisterScreen({super.key}); @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Register')), body: const Center(child: Text('Register screen'))); }
class RoomScreen extends StatelessWidget { const RoomScreen({super.key}); @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Room')), body: const Center(child: Text('Room view'))); }
class UploadScreen extends StatelessWidget { const UploadScreen({super.key}); @override Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Upload')), body: const Center(child: Text('Upload audio'))); }
