import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, RefreshCw, Database } from "lucide-react";

export function SystemSettings() {
  const { toast } = useToast();
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Footprint Advertising Solutions LLC",
    adminEmail: "admin@footprintadvertising.com",
    dateFormat: "DD/MM/YYYY",
    timeZone: "UTC+04:00", 
    language: "en",
  });

  // Handle general settings change
  const handleGeneralChange = (key: keyof typeof generalSettings, value: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle save settings
  const handleSaveSettings = () => {
    // In a real application, this would save to a database
    toast({
      title: "Settings Saved",
      description: "Your system settings have been updated successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="mr-2 h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>
            Configure basic system settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                id="companyName" 
                value={generalSettings.companyName}
                onChange={(e) => handleGeneralChange("companyName", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input 
                id="adminEmail" 
                type="email"
                value={generalSettings.adminEmail}
                onChange={(e) => handleGeneralChange("adminEmail", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select 
                value={generalSettings.dateFormat}
                onValueChange={(value) => handleGeneralChange("dateFormat", value)}
              >
                <SelectTrigger id="dateFormat">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeZone">Time Zone</Label>
              <Select 
                value={generalSettings.timeZone}
                onValueChange={(value) => handleGeneralChange("timeZone", value)}
              >
                <SelectTrigger id="timeZone">
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC+00:00">UTC+00:00</SelectItem>
                  <SelectItem value="UTC+04:00">UTC+04:00 (Gulf)</SelectItem>
                  <SelectItem value="UTC+05:30">UTC+05:30 (India)</SelectItem>
                  <SelectItem value="UTC-05:00">UTC-05:00 (Eastern US)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">System Language</Label>
              <Select 
                value={generalSettings.language}
                onValueChange={(value) => handleGeneralChange("language", value)}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Configure database backups and data retention policies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="backupFrequency">Backup Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger id="backupFrequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataRetention">Data Retention (days)</Label>
              <Input id="dataRetention" type="number" defaultValue="90" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch id="enableBackups" defaultChecked />
            <Label htmlFor="enableBackups">Enable automatic backups</Label>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardFooter className="flex justify-between pt-5">
          <Button variant="outline">Reset to Defaults</Button>
          <Button onClick={handleSaveSettings} className="bg-orange-600 hover:bg-orange-700">
            <Save className="mr-2 h-4 w-4" /> Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}