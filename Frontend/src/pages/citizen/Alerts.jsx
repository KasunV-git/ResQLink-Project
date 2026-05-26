import { useState } from 'react';
import { Link } from 'react-router';
import { Shield, AlertCircle, MapPin, Bell, Home, FileText, HelpCircle, Menu, X, Upload, Navigation } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { mockAlerts, mockResources } from '../data/mockData';
import { toast } from 'sonner';
import DisasterMap from '../components/DisasterMap';
import { mockDisasters } from '../data/mockData';

export default function Alerts() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('home');
    const [reportForm, setReportForm] = useState({
        type: '',
        location: '',
        description: '',
    });

    const handleSubmitReport = (e) => {
        e.preventDefault();
        toast.success('Disaster report submitted successfully! Authorities have been notified.', {
            description: 'You will receive updates via notifications.',
        });
        setReportForm({ type: '', location: '', description: '' });
        setActiveTab('home');
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Emergency':
                return 'destructive';
            case 'Warning':
                return 'default';
            default:
                return 'secondary';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Header */}
            <header className="sticky top-0 z-50 bg-primary text-white shadow-lg lg:hidden">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6" />
                        <span className="text-lg">ResQLink</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <nav className="border-t border-white/10 p-4 space-y-2">
                        <Link to="/">
                            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                                Back to Home
                            </Button>
                        </Link>
                    </nav>
                )}
            </header>

            {/* Desktop Header */}
            <header className="hidden lg:block sticky top-0 z-50 bg-primary text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="w-8 h-8" />
                            <span className="text-xl">ResQLink</span>
                            <Badge variant="secondary" className="ml-2">Citizen Portal</Badge>
                        </div>
                        <Link to="/">
                            <Button variant="ghost" className="text-white hover:bg-white/10">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-4 lg:p-6">
                {/* Emergency Report Button - Always Visible */}
                <div className="mb-6">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg" className="w-full bg-destructive hover:bg-destructive/90 text-lg h-14 shadow-lg">
                                <AlertCircle className="w-6 h-6 mr-2 animate-pulse" />
                                🚨 Report Emergency
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-2xl text-destructive">Report Disaster</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmitReport} className="space-y-4">
                                <div>
                                    <Label>Incident Type</Label>
                                    <Select value={reportForm.type} onValueChange={(val) => setReportForm({ ...reportForm, type: val })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select disaster type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="flood">Flood</SelectItem>
                                            <SelectItem value="fire">Fire</SelectItem>
                                            <SelectItem value="earthquake">Earthquake</SelectItem>
                                            <SelectItem value="building_collapse">Building Collapse</SelectItem>
                                            <SelectItem value="gas_leak">Gas Leak</SelectItem>
                                            <SelectItem value="landslide">Landslide</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Location</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Enter location or address"
                                            value={reportForm.location}
                                            onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                                            required
                                        />
                                        <Button type="button" variant="outline" size="icon">
                                            <Navigation className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Click GPS icon to use current location</p>
                                </div>

                                <div>
                                    <Label>Description</Label>
                                    <Textarea
                                        placeholder="Describe the situation in detail..."
                                        rows={4}
                                        value={reportForm.description}
                                        onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Upload Images/Videos (Optional)</Label>
                                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, MP4 up to 10MB</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button type="submit" className="flex-1 bg-destructive hover:bg-destructive/90">
                                        Submit Report
                                    </Button>
                                    <DialogTrigger asChild>
                                        <Button type="button" variant="outline" className="flex-1">
                                            Cancel
                                        </Button>
                                    </DialogTrigger>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Alerts & Resources */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Active Alerts */}
                        <Card className="border-l-4 border-l-destructive">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 text-primary">
                                        <Bell className="w-5 h-5" />
                                        Active Alerts
                                    </h2>
                                    <Badge variant="destructive" className="animate-pulse">
                                        {mockAlerts.length} Active
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {mockAlerts.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow bg-card"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="w-5 h-5 text-destructive" />
                                                <h4 className="text-primary">{alert.title}</h4>
                                            </div>
                                            <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {alert.location}
                                            </span>
                                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Live Map */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-primary">Disaster Zones & Safe Areas</h2>
                            </CardHeader>
                            <CardContent>
                                <DisasterMap disasters={mockDisasters} height="400px" />
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="w-full">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        Find Safe Zones
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        <Navigation className="w-4 h-4 mr-2" />
                                        Share Location
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Quick Actions & Resources */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card className="bg-gradient-to-br from-primary to-accent text-white">
                            <CardHeader>
                                <h2>Quick Actions</h2>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button className="w-full bg-white text-primary hover:bg-white/90" onClick={() => toast.info('Help request sent to nearby volunteers')}>
                                    <HelpCircle className="w-4 h-4 mr-2" />
                                    Request Help
                                </Button>
                                <Button className="w-full bg-white/10 hover:bg-white/20 text-white" onClick={() => toast.success('Your location has been shared with emergency services')}>
                                    <Navigation className="w-4 h-4 mr-2" />
                                    Share Live Location
                                </Button>
                                <Button className="w-full bg-white/10 hover:bg-white/20 text-white">
                                    <FileText className="w-4 h-4 mr-2" />
                                    View My Reports
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Safety Instructions */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-primary">Safety Guidelines</h3>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                                        1
                                    </div>
                                    <div>
                                        <p className="text-sm">Stay calm and assess your surroundings</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                                        2
                                    </div>
                                    <div>
                                        <p className="text-sm">Move to higher ground if flooding</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                                        3
                                    </div>
                                    <div>
                                        <p className="text-sm">Call emergency hotline: 911</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                                        4
                                    </div>
                                    <div>
                                        <p className="text-sm">Follow official evacuation orders</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Resource Availability */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-primary">Resource Centers</h3>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {mockResources.slice(0, 4).map((resource) => (
                                    <div key={resource.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${resource.available ? 'bg-accent' : 'bg-muted-foreground'}`}></div>
                                            <div>
                                                <p className="text-sm">{resource.name}</p>
                                                <p className="text-xs text-muted-foreground">{resource.location}</p>
                                            </div>
                                        </div>
                                        <Badge variant={resource.available ? 'secondary' : 'outline'}>
                                            {resource.quantity}
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}