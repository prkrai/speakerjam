import 'package:flutter/material.dart';

class SyncDiagnosticsScreen extends StatefulWidget {
  const SyncDiagnosticsScreen({super.key});

  @override
  State<SyncDiagnosticsScreen> createState() => _SyncDiagnosticsScreenState();
}

class _SyncDiagnosticsScreenState extends State<SyncDiagnosticsScreen> {
  double offset = 0;
  double rtt = 0;
  String scheduledStartTime = '—';
  String actualStartTime = '—';
  double startError = 0;
  String syncHealth = 'unknown';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sync Diagnostics')),
      body: RefreshIndicator(
        onRefresh: () async {
          setState(() {
            offset = 0;
            rtt = 0;
            scheduledStartTime = '—';
            actualStartTime = '—';
            startError = 0;
            syncHealth = 'refreshing';
          });
        },
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _metricTile('Clock Offset', '${offset.toStringAsFixed(2)} ms'),
            _metricTile('RTT', '${rtt.toStringAsFixed(2)} ms'),
            _metricTile('Scheduled Start Time', scheduledStartTime),
            _metricTile('Actual Start Time', actualStartTime),
            _metricTile('Start Error', '${startError.toStringAsFixed(2)} ms'),
            _metricTile('Sync Health', syncHealth),
          ],
        ),
      ),
    );
  }

  Widget _metricTile(String label, String value) {
    return Card(
      child: ListTile(
        title: Text(label),
        subtitle: Text(value),
      ),
    );
  }
}
